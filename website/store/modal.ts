import { create } from "zustand";

/* ── Modal types ─────────────────────────────────────────────
 * Add new modal types here as the app grows.
 * Each type can optionally carry typed props.
 */

export type SelectTeamProps = {
    matchId: string;
    tournamentId: string;
    amount: { coins: number; amount: number };
};

export type ModalPayload =
    | { type: "ADD_GAME"; props?: undefined }
    | { type: "CREATE_TEAM"; props?: undefined }
    | { type: "SELECT_TEAM"; props: SelectTeamProps }
    | { type: "PROFILE_IMAGE"; props?: undefined };

/* ── Store ─────────────────────────────────────────────────── */

type ModalState = {
    /** Currently open modal (null = nothing open) */
    modal: ModalPayload | null;

    /** Open a modal. Pass the type and optional props. */
    openModal: <T extends ModalPayload>(payload: T) => void;

    /** Close the current modal. */
    closeModal: () => void;
};

export const useModalStore = create<ModalState>()((set) => ({
    modal: null,
    openModal: (payload) => set({ modal: payload }),
    closeModal: () => set({ modal: null }),
}));
