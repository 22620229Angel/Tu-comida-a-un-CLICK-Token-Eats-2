import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CDOEXGYDRQLO2T5PS2DD3NG4BREWWUORCKDMKXM3H7RAV3FFSWOVLAHQ",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAAT",
            "AAAAAAAAAAAAAAAJZ2V0X29yZGVyAAAAAAAAAQAAAAAAAAAIb3JkZXJfaWQAAAAEAAAAAQAAA+oAAAAA",
            "AAAAAAAAADxJbmljaWFsaXphIGVsIGNvbnRyYXRvIGNvbiBhZG1pbmlzdHJhZG9yIHkgZXN0YWRvcyBkZSBwZWRpZG8AAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAALYWRkX3Byb2R1Y3QAAAAAAwAAAAAAAAAEbmFtZQAAABAAAAAAAAAACHF1YW50aXR5AAAABQAAAAAAAAAFcHJpY2UAAAAAAAAFAAAAAA==",
            "AAAAAAAAAAAAAAALZ2V0X3Byb2R1Y3QAAAAAAQAAAAAAAAAEbmFtZQAAABAAAAABAAAD6gAAAAA=",
            "AAAAAAAAAAAAAAALbGlzdF9vcmRlcnMAAAAAAAAAAAEAAAPqAAAABA==",
            "AAAAAAAAAAAAAAAMY3JlYXRlX29yZGVyAAAAAQAAAAAAAAAIcHJvZHVjdHMAAAPqAAAAEAAAAAEAAAAE",
            "AAAAAAAAAAAAAAANbGlzdF9wcm9kdWN0cwAAAAAAAAAAAAABAAAD6gAAABA=",
            "AAAAAAAAAAAAAAAOZGVjcmVhc2Vfc3RvY2sAAAAAAAIAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZhbW91bnQAAAAAAAUAAAAA",
            "AAAAAAAAAAAAAAAOaW5jcmVhc2Vfc3RvY2sAAAAAAAIAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZhbW91bnQAAAAAAAUAAAAA",
            "AAAAAAAAAAAAAAAOcmVtb3ZlX3Byb2R1Y3QAAAAAAAEAAAAAAAAABG5hbWUAAAAQAAAAAA==",
            "AAAAAAAAAAAAAAAOdHJhbnNmZXJfYWRtaW4AAAAAAAEAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAAA",
            "AAAAAAAAAAAAAAAOdXBkYXRlX3Byb2R1Y3QAAAAAAAMAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAhxdWFudGl0eQAAAAUAAAAAAAAABXByaWNlAAAAAAAABQAAAAA=",
            "AAAAAAAAAAAAAAATdXBkYXRlX29yZGVyX3N0YXR1cwAAAAACAAAAAAAAAAhvcmRlcl9pZAAAAAQAAAAAAAAABnN0YXR1cwAAAAAAEAAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        get_admin: (this.txFromJSON),
        get_order: (this.txFromJSON),
        initialize: (this.txFromJSON),
        add_product: (this.txFromJSON),
        get_product: (this.txFromJSON),
        list_orders: (this.txFromJSON),
        create_order: (this.txFromJSON),
        list_products: (this.txFromJSON),
        decrease_stock: (this.txFromJSON),
        increase_stock: (this.txFromJSON),
        remove_product: (this.txFromJSON),
        transfer_admin: (this.txFromJSON),
        update_product: (this.txFromJSON),
        update_order_status: (this.txFromJSON)
    };
}
