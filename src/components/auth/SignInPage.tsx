import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
        <p className="mt-2 text-sm text-gray-600">Sign in to access BCA Question Papers</p>
      </div>
      <div className="mt-8">
        <SignIn routing="path" path="/sign-in" />
      </div>
    </div>
  </div>
);

export default SignInPage;
