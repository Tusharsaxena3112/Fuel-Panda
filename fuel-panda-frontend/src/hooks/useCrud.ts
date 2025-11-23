import { useMutation, useQuery } from "@tanstack/react-query";
import { createOne, list } from "../api/crud";

export function useCrud(keys:string[], path: string, params?:{}) {

  const query = useQuery({
    queryKey: keys,
    queryFn: () => list(path, params),
  });

  const create = useMutation({
    mutationFn: (data: any) => createOne(path, data),
  });

  return { query, create };
}
