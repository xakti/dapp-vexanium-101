import {ref} from "vue";
import {APIClient} from "@wharfkit/antelope";
import {ABICache} from "@wharfkit/abicache";

const Store = {
    account: ref(""),
    /**
     * @type {Herlina}
     */
    herlina: undefined,
    /**
     * @type {WalletSession}
     */
    session: undefined,
    /**
     * @type {APIClient}
     */
    client: undefined,
    /**
     * @type {ABICache}
     */
    abiCache: undefined,


    initWharfKit() {
        const client = new APIClient({url: "https://v2.vexascan.com:2096"});
        this.abiCache = new ABICache(client);
        this.client = client;
    },
    isWalletConnected() {
        return (this.session && this.session.isOpen());
    }
};

export default Store;
