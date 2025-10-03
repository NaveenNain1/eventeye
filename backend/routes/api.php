<?php

use App\Http\Controllers\Api\ImageGenController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\OtpAuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\TemplateStudentController;
use App\Http\Controllers\Api\UserCreditController;
use App\Http\Controllers\Api\UserTemplateController;
use Illuminate\Http\Request;

Route::post('/send-otp', [OtpAuthController::class, 'sendOtp']);
Route::post('/verify-otp', [OtpAuthController::class, 'verifyOtp']);
Route::post('/login-wallet', [OtpAuthController::class, 'loginWallet']);
Route::post('/generate-gen', [ImageGenController::class, 'generate']);
  


Route::middleware('auth:user-api')->group(function () {
    Route::get('/user/data',function(Request $request){
        return response()->json([
            'data'=>$request->user()
        ]);
    });
    Route::post('/user/logout', [OtpAuthController::class, 'logout']);
    Route::get('/user/template/{id}', [UserTemplateController::class, 'getsingle']);
    Route::delete('/user/template/{id}', [UserTemplateController::class, 'deletesingle']);
    Route::post('/user/template', [UserTemplateController::class, 'store']);
    Route::get('/user/template', [UserTemplateController::class, 'get']);
 
    Route::post('/user/template/temp/{id}', [UserTemplateController::class, 'save_template']);
    Route::get('/user/template/temp/{id}', [UserTemplateController::class, 'get_template']);
  
    Route::post('/user/template/post/{id}', [PostController::class, 'create_post']);
    Route::get('/user/template/post-generated/{id}', [PostController::class, 'get']);
    Route::get('/user/posts/all-posts', [PostController::class, 'all']);


    Route::get('/user/unsplash/search', [PostController::class, 'search_image']);
    Route::get('/user/template/post-generated/update-img/{id}', [PostController::class, 'update_image']);




    Route::get('/user/credits/transactions', [UserCreditController::class, 'transactions']);
    Route::get('/user/credits/balance', [UserCreditController::class, 'balance']);
    Route::get('/user/credits/createOrder', [UserCreditController::class, 'createOrder']);
    Route::get('/user/credits/verifyPayment', [UserCreditController::class, 'verifyPayment']);

      Route::get('/user/students', [TemplateStudentController::class, 'index']);
    Route::post('/user/students', [TemplateStudentController::class, 'store']);
    Route::get('/user/students/{id}', [TemplateStudentController::class, 'show']);
    Route::put('/user/students/{id}', [TemplateStudentController::class, 'update']);
    Route::delete('/user/students/{id}', [TemplateStudentController::class, 'destroy']);
    Route::post('/user/students/import/csv', [TemplateStudentController::class, 'importCsv'])->middleware('auth:sanctum');

    Route::post('/user/students/corrent_spelling', [TemplateStudentController::class, 'store']);

});
    Route::get('/students/certidata/{id}',[TemplateStudentController::class, 'get_certi']);
    Route::post('/students/send_mail', [TemplateStudentController::class, 'send_mail']);

    Route::get('/test', [PostController::class, 'test']);
 
