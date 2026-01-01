import SimpleInput from "@/components/inputs/SimpleInput";
import { useUser } from "@/helpers/client";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

export default function ProfileSettings() {
  const { user } = useUser();
  // const form = useForm({
  //   defaultValues: {
  //     email: user["email"],
  //   },
  // });
  //
  //
  if (!user) {
    return (
      <div className="ring p-4 rounded-box fade grid place-items-center">
        <div className="">
          <h2 className="text-xl font-bold text-current/70">
            <Link to="/auth/login">Login To Continue</Link>
          </h2>
        </div>
      </div>
    );
  }
  return (
    <div className="ring p-4 rounded-box fade">
      {/*<SimpleInput value={user.fullName} />*/}
      {JSON.stringify(user)}
    </div>
  );
}
