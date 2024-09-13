import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton } from "@mui/material";
import Image from "next/image";

interface Props {
    openModal: boolean;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'black',
    boxShadow: 24,
};

const SearchBox: React.FC<Props> = ({ openModal }) => {

    const [openSearchBox, setOpenSearchBox] = useState<boolean>(openModal);
    const handleClose = () => setOpenSearchBox(false);

    useEffect(() => {
        console.log(openSearchBox);
    }, [openSearchBox])

    return (

        <div>
            <Modal
                open={openSearchBox}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <header className="flex px-2 flex-row justify-between items-center">
                        <SearchIcon color="primary" fontSize="medium" />
                        <input
                            placeholder="Search your desired songs ..."
                            className="bg-inherit px-5 text-white border-none w-full border focus:outline-none focus:border-transparent"
                            type="text"
                        />
                        <IconButton color="primary" aria-label="search-icon">
                            <CloseIcon fontSize="medium" />
                        </IconButton>
                    </header>
                    <div className="border border-slate-800"></div>
                    <section className="overflow-y-auto text-slate-400 p-5 flex flex-col [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full h-[50vh]">
                        <div className="cursor-pointer py-3 flex flex-row items-center hover:bg-slate-950 gap-5">
                            <Image className="aspect-square" height={30} width={30} src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb4IINlvVCjQcXJvgSYS8nq8QlS_zyFoGBQQ&s"} alt="thumbnail" />
                            <p className="">Sanam teri kasam</p>
                        </div>
                    </section>
                </Box>
            </Modal>
        </div>
    )
}

export default SearchBox;