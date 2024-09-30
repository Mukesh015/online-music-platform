import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

interface Props {
    newPlaylistArtist: (name: string) => void;
    handleRenamePlaylist: () => void;
}

const RenameInputBox: React.FC<Props> = ({ newPlaylistArtist, handleRenamePlaylist }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [renamedPlaylist, setRenamedPlaylist] = useState<string>("");
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRenamedPlaylist(e.target.value);
        if (renamedPlaylist !== "") newPlaylistArtist(renamedPlaylist);
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const inputBoxVariants = {
        hidden: { opacity: 0, y: "-100%" },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "-100%" },
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={backdropVariants}
            >
                <motion.div
                    className="bg-gray-800 rounded-lg p-6 w-[300px] max-w-full"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={inputBoxVariants}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-white text-lg font-bold mb-4">Rename Playlist</h2>
                    <input
                        ref={inputRef}
                        placeholder="Enter new playlist name..."
                        className="bg-inherit px-5 py-2 text-white border border-gray-600 rounded-md w-full focus:outline-none focus:border-blue-500"
                        type="text"
                        onChange={handleSearchChange}
                        value={renamedPlaylist}
                    />
                    <div className="flex justify-end mt-4">
                        <button onClick={() => handleRenamePlaylist()} className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                            Save
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RenameInputBox;