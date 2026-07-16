<?php

namespace App\Http\Controllers;

// use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Validation\Rules\Password;
// use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    private $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        $fields = ['id', 'name', 'username', 'email', 'phone', 'gender'];

        $users = $this->userService->getAll($fields);

        return response()->json(UserResource::collection($users));
    }

    public function show(int $id){
        try {
            $fields = ['id', 'name', 'username', 'email', 'phone', 'gender', 'photo'];

            $user = $this->userService->getById($id, $fields);

            return response()->json(new UserResource($user));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
    }

    public function store(UserRequest $request)
    {
        $request->validate([
            'password' => 'required|min:6',
        ]);

        $validateData = $request->validated();

        $validateData['password'] = $request->password;
        $validateData['password'] = Hash::make($validateData['password']);

        $user = $this->userService->create($validateData);

        $token = $user->createToken('vistamedia')->plainTextToken;
        return response()->json(new UserResource([
            'user' => $user, 
            'token' => $token
            ]), 201);
    }

    public function update(UserRequest $request, int $id)
    {
        try {
            if($request->password){
                if (auth()->user()->id === $request->id) {
                    $request->validate([
                        'oldPassword' => ['required', 'current_password'],
                        'password' => 'required|min:6',
                    ]);
                }else{
                    $request->validate([
                        'password' => 'required|min:6',
                    ]);
                }
            }

            $validateData = $request->validated();

            if($request->password){
                $validateData['password'] = $request->password;
                $validateData['password'] = Hash::make($validateData['password']);
            }
            
            $user = $this->userService->update($id, $validateData);
            
            return response()->json(new UserResource($user));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
    }

    public function destroy(int $id)
    {
        if(auth()->user()->id === $id){
            return response()->json([
                'failed' => 'Gagal menghapus data users..!!'
            ]);
        }else{
            try {
                $this->userService->delete($id);
                return response()->json([
                    'message' => 'User delete successfuly'
                ]);
            } catch (ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }
        }
    }
}
