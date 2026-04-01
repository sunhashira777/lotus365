import useResponsiveHeights from '@/hooks/useResponsiveHeights';
import { cn } from '@/utils';
import { Icons } from '@/utils/Icons';
import React, { useCallback, useRef, useState } from 'react';

type Props = {
  liveScoreUrl: string;
  liveTvUrl: string;
  type: string;
  isLive: boolean;
};
type CardType = 'scorecard' | 'livetv' | 'odds';
const Scorecard = (props: Props) => {
  const { liveScoreUrl, liveTvUrl, type, isLive } = props;

  const [activeMobileTab, setActiveMobileTab] = useState<CardType>(
    type === 'game' ? 'scorecard' : 'odds'
  );
  const { default: DEFAULT_HEIGHT, expanded: EXPANDED_HEIGHT } = useResponsiveHeights();

  const [iframeHeight, setIframeHeight] = useState<number>(DEFAULT_HEIGHT);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const iframeUrl = activeMobileTab === 'livetv' ? liveTvUrl : liveScoreUrl;
  const isExpanded = iframeHeight === EXPANDED_HEIGHT;

  const handleClose = () => {
    setIsOpen((prev) => {
      if (!prev) setIframeHeight(DEFAULT_HEIGHT); // reset on reopen
      return !prev;
    });
  };

  const handleToggleHeight = useCallback(() => {
    setIframeHeight((prev) => (prev === DEFAULT_HEIGHT ? EXPANDED_HEIGHT : DEFAULT_HEIGHT));
  }, []);

  type TabKey = 'scorecard' | 'livetv' | 'odds';

  const mobileTabs: { key: TabKey; label: string; isLive?: boolean }[] = [
    { key: 'odds', label: 'ODDS' },
    ...(type === 'game'
      ? [{ key: 'scorecard', label: 'SCORECARD' } as { key: TabKey; label: string }]
      : []),
    { key: 'livetv', label: 'LIVE STREAM', isLive: isLive },
  ];

  // Single shared iframe — rendered once, shown in the right context
  const sharedIframe = (url: string | undefined, className: string) =>
    url ? (
      <iframe
        src={url}
        className={className}
        sandbox="allow-scripts allow-same-origin allow-popups"
        allow="autoplay; fullscreen"
        allowFullScreen={true}
      />
    ) : null;
  const handleToggle = (key: CardType) => {
    setActiveMobileTab(key);
    setIframeHeight(DEFAULT_HEIGHT);
  };
  return (
    <div>
      {/* ── MOBILE ── */}
      <div className="xl:hidden">
        <div
          className={cn(
            ' gap-3 font-normal text-center my-2',
            type === 'game' ? 'grid grid-cols-3' : 'grid grid-cols-2'
          )}
        >
          {mobileTabs.map((tab) => {
            const isDisabled = tab.key === 'livetv' && !tab.isLive;

            return (
              <div
                key={tab.key}
                onClick={() => {
                  if (isDisabled) return; // ❌ prevent click
                  handleToggle(tab.key);
                }}
                className={cn(
                  'py-1 px-3 border text-xs rounded-[20px] transition-all',
                  isDisabled
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-white` cursor-pointer',
                  activeMobileTab === tab.key && !isDisabled && 'bg-btn-gradient2 text-white'
                )}
              >
                {tab.key === 'livetv' ? (tab.isLive ? 'LIVE TV' : 'STARTS SOON') : tab.label}
              </div>
            );
          })}
        </div>

        {activeMobileTab !== 'odds' && (
          <div className="relative bg-[#322f32] overflow-hidden rounded-md">
            <div
              style={{
                height: `${iframeHeight}px`,
                transition: 'height 300ms ease',
              }}
            >
              {sharedIframe(iframeUrl, 'w-full h-full')}
            </div>

            {/* Expand toggle — mobile only, no livetv expand */}
            {activeMobileTab === 'scorecard' && (
              <div className="bg-[#322f32] w-full flex justify-center py-1">
                <button onClick={handleToggleHeight}>
                  {isExpanded ? (
                    <Icons.arrowUp className="text-white text-lg" />
                  ) : (
                    <Icons.arrowDown className="text-white text-lg" />
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* ── DESKTOP ── */}
      {type === 'game' && (
        <div className="hidden xl:block">
          <div
            className="xl:bg-btn-gradient2 flex items-center justify-between text-xs font-normal py-2 px-5 rounded-[20px] border border-white cursor-pointer"
            onClick={handleClose}
          >
            <div>LIVE SCORE</div>
            {isOpen ? <Icons.arrowUp /> : <Icons.arrowDown />}
          </div>

          <div
            className="relative bg-[#322f32] touch-manipulation overflow-hidden"
            style={{
              height: isOpen ? `${iframeHeight}px` : '0px',
              transition: 'height 300ms ease',
            }}
          >
            {isOpen && (
              <>
                <div className="flex rounded-sm p-1 h-full">
                  {sharedIframe(liveScoreUrl, 'flex-1 w-full h-full')}
                </div>

                <div className="bg-[#322f32] w-full absolute bottom-0 flex justify-center">
                  <button onClick={handleToggleHeight}>
                    {isExpanded ? (
                      <Icons.arrowUp className="text-white text-lg" />
                    ) : (
                      <Icons.arrowDown className="text-white text-lg" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Scorecard;
