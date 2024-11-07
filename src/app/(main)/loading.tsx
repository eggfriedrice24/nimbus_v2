import { TailSpin } from "@/components/tailspin"

export default function loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <TailSpin className="size-6" />
    </div>
  )
}
