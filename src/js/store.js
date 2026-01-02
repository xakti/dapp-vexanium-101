import {ref} from "vue";
import {APIClient} from "@wharfkit/antelope";
import {ABICache} from "@wharfkit/abicache";

export const vexascan = "https://vexascan.com:8443";
export const wind = "https://api.windcrypto.com";

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
        const client = new APIClient({url: vexascan});
        this.abiCache = new ABICache(client);
        this.client = client;
    },
    isWalletConnected() {
        return (this.session && this.session.isOpen());
    }
};

export default Store;
