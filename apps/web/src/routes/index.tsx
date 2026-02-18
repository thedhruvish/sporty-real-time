import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/components/home";
import { z } from "zod";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: z.object({
    panelOpen: z.boolean().default(true),
  }),
});

function HomeComponent() {
  const {panelOpen} = Route.useSearch();
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
