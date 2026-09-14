import * as RadixTooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

interface TooltipProps {
    content: string | ReactNode;
    children: ReactNode;
    delayDuration?: number;
}

export default function Tooltip({ content, children, delayDuration = 300 }: TooltipProps) {
    return (
        <RadixTooltip.Provider delayDuration={delayDuration}>
            <RadixTooltip.Root>
                <RadixTooltip.Trigger asChild>
                    {children}
                </RadixTooltip.Trigger>

                <RadixTooltip.Portal>
                    <RadixTooltip.Content
                        className="z-[1000] shadow-lg bg-surface border border-brand/50 text-main px-3 py-2 rounded-lg shadow-xl text-xs font-medium tracking-wide break-words max-w-[250px] animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
                        sideOffset={5}
                    >
                        {content}
                        {/* <RadixTooltip.Arrow className="fill-main" /> */}
                    </RadixTooltip.Content>
                </RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    );
}