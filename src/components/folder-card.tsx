"use client";

import { Folder, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FolderCardProps {
  name: string;
  cardCount: number;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function FolderCard({
  name,
  cardCount,
  onClick,
  onEdit,
  onDelete,
}: FolderCardProps) {
  const handleMenuClick = (
    e: React.MouseEvent<HTMLDivElement>,
    action: () => void,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <div className="relative group">
      <div
        onClick={onClick}
        className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-black dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 active:bg-gray-50 dark:active:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors min-h-[140px] sm:min-h-[160px]"
      >
        <Folder
          className="w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-3 text-black dark:text-white"
          strokeWidth={2}
        />
        <p className="text-center mb-1 break-words max-w-full px-2 text-sm sm:text-base dark:text-white">
          {name}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          {cardCount} card{cardCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div
        className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black h-8 w-8 p-0"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                e.stopPropagation()
              }
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-2 border-black dark:border-gray-600 dark:bg-gray-900"
          >
            <DropdownMenuItem
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                handleMenuClick(e, onEdit)
              }
              className="dark:text-white cursor-pointer"
            >
              Edit Name
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                handleMenuClick(e, onDelete)
              }
              className="text-red-600 focus:text-red-600 dark:focus:text-red-500 cursor-pointer"
            >
              Delete Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
