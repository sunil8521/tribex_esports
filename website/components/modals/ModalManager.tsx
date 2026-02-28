"use client";

import { useModalStore } from "@/store/modal";
import ProfileImageModal from "./ProfileImageModal";

// Import modal components as you build them
// import AddGameProfileModal from "./AddGameProfileModal";
// import CreateTeamModal from "./CreateTeamModal";
// import TeamSelectModal from "./TeamSelectModal";

/**
 * Global modal renderer — mount once in layout.
 * Reads from Zustand modal store and renders the matching modal.
 */
export default function ModalManager() {
    const modal = useModalStore((s) => s.modal);
    const closeModal = useModalStore((s) => s.closeModal);

    if (!modal) return null;

    switch (modal.type) {

        case "PROFILE_IMAGE":
            return <ProfileImageModal isOpen onClose={closeModal} />;

        case "ADD_GAME":
            // return <AddGameProfileModal isOpen onClose={closeModal} />;
            return null; // TODO: build AddGameProfileModal

        case "CREATE_TEAM":
            // return <CreateTeamModal isOpen onClose={closeModal} />;
            return null; // TODO: build CreateTeamModal

        case "SELECT_TEAM":
            // return <TeamSelectModal isOpen onClose={closeModal} {...modal.props} />;
            return null; // TODO: build TeamSelectModal

        default:
            return null;
    }
}
