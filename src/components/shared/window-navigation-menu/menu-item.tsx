import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { setFooterMessage } from "@/store/footer-message-slice";
import { useAppDispatch } from "@/store/store";
import { openWindow } from "@/store/window-manager-slice";
import { MenuItemProps } from "@/types";

export default function MenuItem({
  label,
  disabled = false,
  shortcut,
  opensWindow,
  handleSetMessage,
}: MenuItemProps) {
  const dispatch = useAppDispatch();

  return (
    <DropdownMenuItem
      className={`menu-button${disabled ? "-disabled" : ""} ${
        shortcut ? "flex justify-between" : ""
      }`}
      onMouseEnter={handleSetMessage}
      onMouseLeave={() => dispatch(setFooterMessage(""))}
      onClick={
        opensWindow !== undefined
          ? () => dispatch(openWindow(opensWindow))
          : undefined
      }
    >
      <span>{label}</span>
      {shortcut && <span>{shortcut}</span>}
    </DropdownMenuItem>
  );
}
