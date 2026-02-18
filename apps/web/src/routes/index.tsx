import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Home } from "@/components/home";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: z.object({
    panelOpen: z.boolean().default(true),
  }),
});

function HomeComponent() {
  const { panelOpen } = Route.useSearch();
  const navigate = Route.useNavigate();
  const togglePenel = () => {
    navigate({
      search: {
        panelOpen: !panelOpen,
      },
    });
  };
  return <Home panelOpen={panelOpen} togglePanel={togglePenel} />;
}
