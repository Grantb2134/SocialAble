import type { NextApiRequest, NextApiResponse } from 'next'
import { GraphQLClient, gql } from 'graphql-request'


const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;
const graphcmsToken = process.env.GRAPHCMS_TOKEN;
type Data = {
  name: string
}

export default async function comments(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (graphqlAPI){
      const graphQLClient = new GraphQLClient(graphqlAPI, { 
        headers: {
          authorization: `Bearer ${graphcmsToken}`
        }
      })
    

    const query = gql `
      mutation CreateComment ( $name: String!, $email: String!, $comment: String!, $slug: String! ) {
        createComment(data: { name: $name, email: $email, comment: $comment, post: { connect: { slug: $slug }}}) {id}
      }
    `
    try {
      const result = await graphQLClient.request(query, req.body)
      return res.status(200).send(result);
    } catch (error) {
      if (error){
        return res.status(500).send({
          name: "unable to create comment",
          ...error
        }) 
      }
    }
  }
}
