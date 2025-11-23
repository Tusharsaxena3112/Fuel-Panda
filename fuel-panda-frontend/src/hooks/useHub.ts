import { useMutation, useQuery } from "@tanstack/react-query";
import { createOne, list } from "../api/crud";

export function useHub() {

  const query = useQuery({
    queryKey: ["hubs"],
    queryFn: () => list("/hubs"),
  });

  const create = useMutation({
    mutationFn: (data: any) => createOne('/hubs', data),
  });

  return { query, create };
}
