import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";


const fastify = Fastify().withTypeProvider().setValidatorCompiler(TypeBoxValidatorCompiler);

const UserSchema = Type.Object({
  id: Type.String(),
  name: Type.String()
}, { $id: 'UserSchema' });

// ISSUE: This doesn't work:
fastify.addSchema(UserSchema);

async function routes(instance: FastifyInstance) {
  // WORKING: This works fine:
  // fastify.addSchema(UserSchema);

  const RequestSchema = Type.Union([
    Type.Ref(UserSchema),
  ])
  const ResponseSchema = Type.Union([
    Type.Ref(UserSchema)
  ], { $id: 'ResponseSchema' });

  instance.post('/', {
    schema: {
      body: RequestSchema,
      response: {
        200: ResponseSchema,
      }
    }
  }, (request: FastifyRequest, reply: FastifyReply) => {
    reply.send("Ok");
  });
}

fastify.register(routes);

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server listening on', address);
});
