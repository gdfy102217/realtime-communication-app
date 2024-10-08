import { useCurrentMember } from "@/features/members/api/use-current-member";
import { UseGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { AlertTriangle, HashIcon, Loader, MessageSquare, SendHorizonal } from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-id";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const [_open, setOpen] = useCreateChannelModal();
  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = UseGetWorkspace({ id: workspaceId });
  const { data: channels, isLoading: channelsLoading} = useGetChannels({ workspaceId });
  const { data: members, isLoading: membersLoading} = useGetMembers({ workspaceId });

  if (memberLoading || workspaceLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <Loader className="text-white size-5 animate-spin" />
      </div>
    );
  }

  if (!member || !workspace) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className="text-white size-5" />
        <p className="text-sm text-white">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"}/>
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem 
          label="Threads"
          icon={MessageSquare}
          id="threads"
        />
        <SidebarItem 
          label="Draft & Sent"
          icon={SendHorizonal}
          id="drafts"
        />
        </div>
        <WorkspaceSection
          label="Channels"
          hint="New channels"
          onNew={member.role === "admin" ? () => setOpen(true) : undefined}
        >
          {channels?.map((item) => (
            <SidebarItem 
              key={item._id}
              label={item.name}
              icon={HashIcon}
              id={item._id}
              variant={item._id === channelId ? "active": "default"}
            />
          ))}
        </WorkspaceSection>
        <WorkspaceSection
          label="Direct messages"
          hint="Send direct message"
          onNew={() => {}}
        >
      {members?.map((item) => (
        <UserItem 
          key={item._id}
          id={item._id}
          label={item.user.name}
          image={item.user.image}
        />
      ))}
      </WorkspaceSection>
    </div>
  )
}