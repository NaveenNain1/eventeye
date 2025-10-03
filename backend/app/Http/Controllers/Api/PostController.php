<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserCredit;
use App\Models\UserProject;
use App\Models\UserTemplate;
use App\Services\GeminiService;
use App\Services\OllamaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PostController extends Controller
{
    //
    public function create_post($id,Request $request){
        $request->validate([
            'title'=>'string|required',
            'captionBased'=>'string|required',
            'subcategory'=>'string|required',
            'main_category'=>'string|required',
            
            // 'id'=>'request'
        ]);
          $UserTemplate= UserTemplate::where('id',$id)->where('user_id',$request->user()->id)->first();
  if(!$UserTemplate)
  {
    return response()->json(['message'=>'Not found'],404);
  }

        if(UserCredit::where('user_id',$request->user()->id)->sum('amt')<2){
            return response()->json([
                'message'=>'You don\'t have enough token to generate a post'
            ],500);
        }
        //  $ollama = new OllamaService(); # FOR OLLAMA
        $ollama = new GeminiService();
$prompt = '
You are an API. 
Output ONLY valid JSON (no markdown, no extra text).
Always respond in the user\'s preferred language.

Schema:
{
  "title": "string",
  "summary": "string", // like an Instagram post text. Highlight key points using <sec> tags.
  "caption": "string", // If "Caption Based" = yes → main content goes here. If no → keep it short & minimal.
  "keywords": ["string"], // 5–10 SEO-friendly keywords
  "unsplash_query": "string" // search query for Unsplash
}

Rules:
- Use <sec> tags to highlight  important words in summary. 
- Do not add formatting, explanations, or text outside JSON. 
- Never assume user will read long captions if "Caption Based" = no.
- Keep title catchy & short.
- It will be instagram post, content on image so like if asked benifits of visiting india, then tell benifits not ecorge user to visit
- Most of content is india based

Now generate the JSON for this Instagram post:
Topic: '.$request->title.'
Subcategory: '.$request->subcategory.'
Main Category: '.$request->main_category.'
Caption Based: '.$request->captionBased.'
Content Language: '.$UserTemplate->language.'
';

    // $response = $ollama->generate('llama3', $prompt); # FOR OLLAMA
    $response = $ollama->generate('gemini-1.5-pro', $prompt);
     $response = str_replace('```json','',$response);
     $response = str_replace('```','',$response);
$data = json_decode($response,true);
$imageUrl = self::getUnsplashImage($data['unsplash_query']);
$UserProject = UserProject::create([
  'title'=>$request->title,
        'aititle'=>$data['title'],
        'summary'=>$data['summary'],
        'keywords'=>json_encode($data['keywords']),'caption'=>$data['caption'],
        'image_path'=>$imageUrl,
        'user_id'=>$request->user()->id,
        'user_template_id'=>$id,
        
          'captionBased'=>$request->captionBased,
            'subcategory'=>$request->subcategory,
            'main_category'=>$request->main_category,
            'image_query'=>$data['unsplash_query']
]);
UserCredit::create([
    'remarks'=>'Post created',
    'amt'=>-2,
    'user_id'=>$request->user()->id
]);
return response()->json([
    'data'=>$UserProject
]);
    }
    public function get($id,Request $request){
        $UserProject = UserProject::where('user_id',$request->user()->id)->where('id',$id)->first();
        if(!$UserProject){
            return response()->json([
                'message'=>'Post not found'
            ],404);

        }
//    $UserTemplate= UserTemplate::where('id',$UserProject->user_template_id)->where('user_id',$request->user()->id)->first();
   $content=  file_get_contents('templates/'.$UserProject->user_template_id.'/template.json',$request->content);

return response()->json([
  'message'=>'Template saved successfull!',
  'data'=>['canvas'=>($content)
  
],
'post'=>$UserProject
]); 
    }
    public function all(Request $request){
    $UserProject = UserProject::where('user_id',$request->user()->id)->with("template")->get();
return response()->json([
 
'posts'=>$UserProject
]); 
    }
public function test(){
    return self::getUnsplashImage("Benifits of using Apple Products");
}
    public function getUnsplashImage($query = 'nature')
{
    $response = Http::withHeaders([
        'Authorization' => 'Client-ID ' . env('UNSPLASH_ACCESS_KEY'),
    ])->get('https://api.unsplash.com/search/photos', [
        'query' => $query,
        'per_page' => 1
    ]);

    $data = $response->json();
    // dd($data);
    // Get first image URL (e.g., regular size)
    $imageUrl = $data['results'][0]['urls']['full'] ?? null;

    return $imageUrl;
}
public function search_image(Request $request){
    $request->validate([
        'search_query'=>'required',
        'images'=>'required'
    ]);
     $response = Http::withHeaders([
        'Authorization' => 'Client-ID ' . env('UNSPLASH_ACCESS_KEY'),
    ])->get('https://api.unsplash.com/search/photos', [
        'query' => $request->search_query,
        'per_page' => $request->images
    ]);
// return $request->query;
    $data = $response->json();
    // return $data;
    $images=[];
    foreach($data['results'] as $key=>$da){
$images[]=$da['urls']['full'];
    }
    return response()->json([
        'images'=>$images
    ]);
}
public function update_image($id,Request $request){
    $request->validate([
        'image_path'=>'required'
    ]);
         $UserProject = UserProject::where('user_id',$request->user()->id)->where('id',$id)->first();
        if(!$UserProject){
            return response()->json([
                'message'=>'Post not found'
            ],404);

        }
        $UserProject->update([
            'image_path'=>$request->image_path
        ]);
        return response()->json([
            'message'=>'Image updated successfull!'
        ]);
}
}
