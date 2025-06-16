import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/common/Card";
import { Input } from "@/components/ui/common/Input";
import { Label } from "@/components/ui/common/Label";
import { Button } from "@/components/ui/common/Button";

export const ProfilePage = () => {
  return (
    // 모바일에서는 수직 간격을 줄인다 (space-y-6)
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-h1-xl text-text-light">프로필 관리</h1>
        <p className="text-text-muted mt-1">
          회원님의 정보를 안전하게 관리하세요.
        </p>
      </div>

      <Card className="border-white/10">
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>이름과 이메일을 변경할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            {/* 모바일에서는 입력창이 꽉, 데스크톱에서는 최대 너비를 갖도록 한다. */}
            <Input id="name" defaultValue="홍길동" className="lg:max-w-sm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              defaultValue="hgd@example.com"
              className="lg:max-w-sm"
            />
          </div>
          <Button variant="outline" className="mt-2">
            정보 저장
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/10">
        <CardHeader>
          <CardTitle>비밀번호 변경</CardTitle>
          <CardDescription>
            주기적인 비밀번호 변경으로 계정을 보호하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">현재 비밀번호</Label>
            <Input
              id="current-password"
              type="password"
              className="lg:max-w-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">새 비밀번호</Label>
            <Input id="new-password" type="password" className="lg:max-w-sm" />
          </div>
          <Button variant="destructive">비밀번호 변경</Button>
        </CardContent>
      </Card>
    </div>
  );
};
