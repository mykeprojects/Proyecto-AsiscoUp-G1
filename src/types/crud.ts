export interface CrudService {
  listar(skip: number, take: number): Promise<unknown[]>;
  buscarPorId(id: number): Promise<unknown>;
  crear(body: unknown): Promise<unknown>;
  actualizar(id: number, body: unknown): Promise<unknown>;
  eliminar(id: number): Promise<void>;
}

export interface CrudRepository<CreateInput, UpdateInput> {
  listar(skip: number, take: number): Promise<unknown[]>;
  buscarPorId(id: number): Promise<unknown | null>;
  crear(data: CreateInput): Promise<unknown>;
  actualizar(id: number, data: UpdateInput): Promise<unknown>;
  eliminar(id: number): Promise<void>;
}
