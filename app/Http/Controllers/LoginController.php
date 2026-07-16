<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required'],
            'password' => ['required'],
        ]);

        if(!auth()->attempt($credentials)){
            return response()->json([
                'message' => 'Credentials are not valid'
            ], 401);
        }

        $user = auth()->user();

        return response()->json([
            'token' => $user->createToken('vistamedia')->plainTextToken,
            'user' => $user
            ]);
    }
}
