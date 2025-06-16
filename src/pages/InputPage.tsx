import { UserInfoForm } from "@/components/forms/UserInfoForm";

export const InputPage = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <UserInfoForm title="사주 입력" buttonText="운세 보기" />
    </div>
  );
};
