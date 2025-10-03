<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TemplateStudent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Mail;

class TemplateStudentController extends Controller
{
    /**
     * List students user-wise + template-wise
     */
    public function index(Request $request)
    {
        $request->validate([
            'user_template_id' => 'required|exists:user_templates,id',
        ]);

        $students = TemplateStudent::where('user_id', $request->user()->id)
            ->where('user_template_id', $request->user_template_id)
            ->get();

        return response()->json($students);
    }

    /**
     * Store new student
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_template_id' => 'required|exists:user_templates,id',
            'name' => 'required|string|max:255',
            'certificate_number' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'mobile' => 'nullable|string|max:20',
            'remarks' => 'nullable|string|max:500',
        ]);

        $student = TemplateStudent::create([
            'user_id' => $request->user()->id,
            'user_template_id' => $request->user_template_id,
            'name' => $request->name,
            'certificate_number' => $request->certificate_number,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'remarks' => $request->remarks,
            'sent' => $request->sent ?? 0,
        ]);

        return response()->json($student, 201);
    }

    /**
     * Show a single student
     */
    public function show($id,Request $request)
    {
        $student = TemplateStudent::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($student);
    }


        public function get_certi($id,Request $request)
    {
        $student = TemplateStudent::where('id', $id)
            ->firstOrFail();
$content=  file_get_contents('templates/'.$student->user_template_id.'/template.json');
if($content == ""){
    return response()->json([
        'message'=>'Certificate not customized!'
    ]);
}
$content = str_replace('{{Student Name}}',$student->name,$content);
$content = str_replace('{{Certificate ID}}',$student->certificate_number,$content);
$content = str_replace('{{Remarks}}',$student->remarks,$content);
        return response()->json([
            'content'=>$content
        ]);
    }

    /**
     * Update student
     */
    public function update(Request $request, $id)
    {
        $student = TemplateStudent::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $student->update($request->only([
            'name',
            'certificate_number',
            'email',
            'mobile',
            'remarks',
            'sent'
        ]));

        return response()->json($student);
    }

    /**
     * Delete student
     */
    public function destroy($id,Request $request)
    {
        $student = TemplateStudent::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $student->delete();

        return response()->json(['message' => 'Student deleted successfully']);
    }

   
     public function importCsv(Request $request)
    {
        $request->validate([
            'user_template_id' => 'required|exists:user_templates,id',
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $path = $request->file('file')->getRealPath();
        $file = fopen($path, 'r');

        // Skip header row
        $header = fgetcsv($file);

        $count = 0;
        while (($row = fgetcsv($file)) !== false) {
            // Adjust columns according to your CSV header order
            TemplateStudent::create([
                'user_id' => Auth::id(),
                'user_template_id' => $request->user_template_id,
                'name' => $row[0] ?? null,
                'certificate_number' => $row[1] ?? null,
                'email' => $row[2] ?? null,
                'mobile' => $row[3] ?? null,
                'remarks' => $row[4] ?? null,
                // 'sent' => $row[5] ?? 0,
            ]);
            $count++;
        }

        fclose($file);

        return response()->json([
            'message' => "CSV imported successfully. {$count} students added.",
        ]);
    }

    public function send_mail(Request $request)
    {
        $request->validate([
            'user_template_id' => 'required|exists:user_templates,id',
        ]);

        $students = TemplateStudent::where('user_template_id', $request->user_template_id)
            ->get();
 
        return response()->json($students);
    }
}
