import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";


const fastify = Fastify().withTypeProvider().setValidatorCompiler(TypeBoxValidatorCompiler);

const UserSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
}, { $id: "UserSchema" });
const ObjectSchema = Type.Object({
  id: Type.String(),
  shape: Type.String(),
}, { $id: "ObjectSchema" });

// ISSUE: This doesn"t work:
// fastify.addSchema(UserSchema);
// fastify.addSchema(ObjectSchema);

async function routes(instance: FastifyInstance) {
  // WORKING: This works fine:
  fastify.addSchema(UserSchema);
  fastify.addSchema(ObjectSchema);

  const RequestSchema = Type.Union([
    Type.Ref(UserSchema),
    Type.Ref(ObjectSchema),
  ], { $id: "RequestSchema" })

  instance.post("/", {
    schema: {
      body: RequestSchema,
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
  console.log("Server listening on", address);
});
