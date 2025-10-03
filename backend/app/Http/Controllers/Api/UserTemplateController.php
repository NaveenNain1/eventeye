<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserTemplate;
use Illuminate\Http\Request;

class UserTemplateController extends Controller
{
    //
    public function store(Request $request){
        $request->validate([
         'name'=>'required|string',
        'category'=>'required|string',
        'language'=>'required|string',
        ]);
     $temp=   UserTemplate::create([
'name'=>$request->name,
'category'=>$request->category,
'language'=>$request->language,
'user_id'=>$request->user()->id
        ]);
        return response()->json([
            'message'=>'Template created successfull!',
            'data'=>$temp
        ]);
    }
    public function save_template($id,Request $request){
        $UserTemplate= UserTemplate::where('id',$id)->where('user_id',$request->user()->id)->first();
  if(!$UserTemplate)
  {
    return response()->json(['message'=>'Not found'],404);
  }
  if(!file_exists('templates/'.$id)){
  mkdir('templates/'.$id);
  }
  file_put_contents('templates/'.$id.'/template.json',$request->content);

return response()->json([
  'message'=>'Template saved successfull!'
]);
}
  public function get_template($id,Request $request){
        $UserTemplate= UserTemplate::where('id',$id)->where('user_id',$request->user()->id)->first();
  if(!$UserTemplate)
  {
    return response()->json(['message'=>'Not found'],404);
  }
$content=  file_get_contents('templates/'.$id.'/template.json',$request->content);
return response()->json([
  'message'=>'Template saved successfull!',
  'data'=>['canvas'=>($content)]
]);
}
    public function get(Request $request){
      return response()->json(
        ['data'=>UserTemplate::where('user_id',$request->user()->id)->get()]
      );
    }
    public  function getsingle($id,Request $request)  {
        $UserTemplate= UserTemplate::where('id',$id)->where('user_id',$request->user()->id)->first();
  if(!$UserTemplate)
  {
    return response()->json(['message'=>'Not found'],404);
  }
  return response()->json([
    'data'=>$UserTemplate
  ]);
    }
        public  function deletesingle($id,Request $request)  {
        $UserTemplate= UserTemplate::where('id',$id)->where('user_id',$request->user()->id)->first();
  if(!$UserTemplate)
  {
    return response()->json(['message'=>'Not found'],404);
  }
  $UserTemplate->delete();
  return response()->json([
  'message'=>'Template deleted successfull!',
  ]);
    }
    
}
