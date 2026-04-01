import { Icons } from '@/utils/Icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
type Props = {
  eventName?: string;
  startTime?: string;
};

const MatchHeader = (props: Props) => {
  const time = dayjs(props.startTime).format('hh:mm A');
  const date = dayjs(props.startTime).format('DD MMMM YYYY');
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-6 bg-sports-header-gradient py-3 px-6 rounded-[48px] mb-2">
      <span
        className="lg:block hidden p-1 bg-btn-gradient2 rounded-full"
        onClick={() => navigate(-1)}
      >
        <Icons.left />
      </span>
      {/* <div className="text-center">
        <div className="text-[14px] font-black tracking-[6px]">{time}</div>
        <div className="text-[10px]">{date}</div>
      </div> */}
      <div className="font-bold text-xs">{props.eventName}</div>
    </div>
  );
};

export default MatchHeader;
