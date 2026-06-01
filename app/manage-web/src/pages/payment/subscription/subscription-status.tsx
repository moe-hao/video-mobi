import { SubscriptionStatus } from "@lib/common/consts/subscription";


export default function SubscriptionStatusPoint({ status, name }: { status: SubscriptionStatus, name: string }) {
  switch (status) {
    case SubscriptionStatus.InActive:
      return (
        <span className= "inline-flex items-center gap-1" >
        <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
          { name }
          </span>
      );
    case SubscriptionStatus.Active:
      return (
        <span className= "inline-flex items-center gap-1" >
        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          { name }
          </span>
      );
    default:
      return (
        <span className= "inline-flex items-center gap-1" >
        <span className="w-2 h-2 rounded-full bg-gray-800 inline-block" />
          { name }
          </span>
      );
  }
}
