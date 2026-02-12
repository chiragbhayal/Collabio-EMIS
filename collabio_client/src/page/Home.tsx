import { Button } from "@/components/ui/button";
import useCreateWorkspaceDialog from "@/hooks/use-create-workspace-dialog";
import { Plus } from "lucide-react";
import Logo from "@/components/logo";
import CreateWorkspaceDialog from "@/components/workspace/create-workspace-dialog";
import useAuth from "@/hooks/api/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { onOpen } = useCreateWorkspaceDialog();
  const { data } = useAuth();
  const navigate = useNavigate();
  const user = data?.user;

  useEffect(() => {
    if (user?.currentWorkspace) {
      navigate(`/workspace/${user.currentWorkspace}`);
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="flex items-center gap-2 font-medium text-2xl">
        <Logo isLink={false} />
        Collabio
      </div>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Collabio</h1>
        <p className="text-muted-foreground text-lg">
          Get started by creating your first workspace
        </p>
      </div>
      <Button onClick={onOpen} size="lg">
        <Plus />
        Create Workspace
      </Button>
      <CreateWorkspaceDialog />
    </div>
  );
};

export default Home;
