import { gql } from "@apollo/client";


// Para conocer ejemplos de queries revisar https://thegraph.com/explorer/subgraph/protofire/maker-protocol

const GET_ACTIVE_ITEMS = gql`
{
    activeTitles(first: 5, where: { buyer: "0x0000000000000000000000000000000000000000"}){
        id
        buyer
        seller
        titleAddress
        tokenId
        price
    }
}
`

export default GET_ACTIVE_ITEMS
