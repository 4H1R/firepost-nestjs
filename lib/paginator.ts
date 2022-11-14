import { createPaginator } from 'prisma-pagination';

export const paginate = createPaginator({ perPage: 20 });
