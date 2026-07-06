import { Input, Label, TextArea } from "@heroui/react";
import type { FeedbackAddReq } from "@lib/common/dto/feedback";
import { useTranslation } from "react-i18next";

export default function BugTab({ feedbackAddReq, onChange }: { feedbackAddReq: FeedbackAddReq; onChange: (req: FeedbackAddReq) => void }) {
  const { t } = useTranslation('', {keyPrefix: 'user-feedback'});

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1 w-full mb-4">
        <Label isRequired htmlFor="input-type-email">{t('email')}</Label>
        <Input id="input-type-email" type="email" value={feedbackAddReq.email} onChange={(e) => onChange({ ...feedbackAddReq, email: e.target.value })} />
      </div>
      <div className="flex flex-col gap-1 w-full mb-4">
        <Label isRequired htmlFor="input-type-description">{t('description')}</Label>
        <TextArea
          aria-label="Bug description"
          className="h-48 w-full"
          value={feedbackAddReq.description}
          onChange={(e) => onChange({ ...feedbackAddReq, description: e.target.value })}
        />
      </div>
    </div>
  );
}
