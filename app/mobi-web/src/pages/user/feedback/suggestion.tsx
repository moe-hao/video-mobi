import type { FeedbackAddReq } from "@lib/common/dto/feedback";
import { useTranslation } from "react-i18next";

export default function SuggestionTab({ feedbackAddReq, onChange }: { feedbackAddReq: FeedbackAddReq; onChange: (req: FeedbackAddReq) => void }) {
  const { t } = useTranslation('', {keyPrefix: 'user-feedback'});
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1 w-full mb-4">
        <label className="text-white text-sm" htmlFor="input-type-email">{t('email')} *</label>
        <input id="input-type-email" type="email" value={feedbackAddReq.email} onChange={(e) => onChange({ ...feedbackAddReq, email: e.target.value })} className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 outline-none focus:border-blue-500" />
      </div>
      <div className="flex flex-col gap-1 w-full mb-4">
        <label className="text-white text-sm" htmlFor="input-type-description">{t('description')} *</label>
        <textarea
          className="h-48 w-full px-4 py-3 bg-white/10 text-white rounded-lg border border-white/20 outline-none focus:border-blue-500 resize-none"
          value={feedbackAddReq.description}
          onChange={(e) => onChange({ ...feedbackAddReq, description: e.target.value })}
        />
      </div>
    </div>
  );
}
