import React from 'react';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userInfoSchema} from '@/lib/schemas';
import type { UserInfoSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/common/Button';
import { Label } from '@/components/ui/common/Label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/common/RadioGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/common/Select';
import * as z from 'zod';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1930 + 1 }, (_, i) => 1930 + i).reverse();
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const TIMES = [
  { value: "unknown", label: "모름" },
  { value: "00:30-02:29", label: "子(자)시 (23:30~01:29)" },
  { value: "02:30-04:29", label: "丑(축)시 (01:30~03:29)" },
  { value: "04:30-06:29", label: "寅(인)시 (03:30~05:29)" },
  { value: "06:30-08:29", label: "卯(묘)시 (05:30~07:29)" },
  { value: "08:30-10:29", label: "辰(진)시 (07:30~09:29)" },
  { value: "10:30-12:29", label: "巳(사)시 (09:30~11:29)" },
  { value: "12:30-14:29", label: "午(오)시 (11:30~13:29)" },
  { value: "14:30-16:29", label: "未(미)시 (13:30~15:29)" },
  { value: "16:30-18:29", label: "申(신)시 (15:30~17:29)" },
  { value: "18:30-20:29", label: "酉(유)시 (17:30~19:29)" },
  { value: "20:30-22:29", label: "戌(술)시 (19:30~21:29)" },
  { value: "22:30-23:29", label: "亥(해)시 (21:00~23:29)" },
];

const coupleFormSchema = z.object({
  me: userInfoSchema,
  partner: userInfoSchema,
});
type CoupleFormSchema = z.infer<typeof coupleFormSchema>;

const FormSection = ({ type }: { type: 'me' | 'partner' }) => {
  const { control, formState: { errors } } = useFormContext<CoupleFormSchema>();
  const title = type === 'me' ? '나의 정보 입력' : '상대방 정보 입력';

  const getError = <K extends keyof UserInfoSchema>(fieldName: K) => {
    const message = errors?.[type]?.[fieldName]?.message;
    return message ? (
      <p className="text-red-500 text-xs mt-1">{message}</p>
    ) : null;
  };

  return (
    <div className="bg-background-main p-4 rounded-lg">
      <h3 className="text-h2-m text-center text-text-light mb-6">{title}</h3>
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>성별</Label>
            <Controller
              name={`${type}.gender`}
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id={`r-male-${type}`} />
                    <Label htmlFor={`r-male-${type}`}>남자</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id={`r-female-${type}`} />
                    <Label htmlFor={`r-female-${type}`}>여자</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>달력 종류</Label>
            <Controller
              name={`${type}.calendarType`}
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solar" id={`r-solar-${type}`} />
                    <Label htmlFor={`r-solar-${type}`}>양력</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lunar" id={`r-lunar-${type}`} />
                    <Label htmlFor={`r-lunar-${type}`}>음력</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>생년</Label>
            <Controller
              name={`${type}.birthYear`}
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                  <SelectContent>{YEARS.map(y => (
                    <SelectItem key={y} value={String(y)}>{y}년</SelectItem>
                  ))}</SelectContent>
                </Select>
              )}
            />
            {getError('birthYear')}
          </div>
          <div className="space-y-2">
            <Label>생월</Label>
            <Controller
              name={`${type}.birthMonth`}
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                  <SelectContent>{MONTHS.map(m => (
                    <SelectItem key={m} value={String(m)}>{m}월</SelectItem>
                  ))}</SelectContent>
                </Select>
              )}
            />
            {getError('birthMonth')}
          </div>
          <div className="space-y-2">
            <Label>생일</Label>
            <Controller
              name={`${type}.birthDay`}
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                  <SelectContent>{DAYS.map(d => (
                    <SelectItem key={d} value={String(d)}>{d}일</SelectItem>
                  ))}</SelectContent>
                </Select>
              )}
            />
            {getError('birthDay')}
          </div>
        </div>

        <div className="space-y-2">
          <Label>생시</Label>
          <Controller
            name={`${type}.birthTime`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <SelectTrigger><SelectValue placeholder="시간을 선택하세요" /></SelectTrigger>
                <SelectContent>{TIMES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}</SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
};

interface CoupleGungapFormProps {
  onSubmit: (data: CoupleFormSchema) => void;
}

export const CoupleGungapForm: React.FC<CoupleGungapFormProps> = ({ onSubmit }) => {
  const methods = useForm<CoupleFormSchema>({
    resolver: zodResolver(coupleFormSchema),
    defaultValues: {
      me: { gender: 'male', calendarType: 'solar' },
      partner: { gender: 'female', calendarType: 'solar' },
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <FormSection type="me" />
        <FormSection type="partner" />
        <div className="pt-4">
          <Button type="submit" className="w-full" size="lg">
            커플궁합 보기
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};