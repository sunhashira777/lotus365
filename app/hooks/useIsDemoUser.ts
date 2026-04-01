import { useSelector } from "react-redux";

export const useIsDemoUser = () =>
  useSelector((state) => state.profile?.role?.name?.toLowerCase() === 'demo');