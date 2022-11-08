import { useState } from 'react';
import { Input, Modal, useNotification } from 'web3uikit';
import { useWeb3Contract } from 'react-moralis';
import titleRegistryAbi from '../../constants/TitleRegistry.json';
import { ethers } from 'ethers';

export interface UpdateListingModalProps {
    titleAddress: string;
    tokenId: string;
    isVisible: boolean;
    address: string;
    onClose: () => void;
}

export const UpdateListingModale = ({
    titleAddress,
    tokenId,
    isVisible,
    address,
    onClose,
}: UpdateListingModalProps) => {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState<
        string | undefined
    >();

    const dispatch = useNotification();
    const handleUpdateListingSuccess = async (tx: any) => {
        await tx.wait(1);
        dispatch({
            type: 'success',
            message: 'El listado se actualizo con exito',
            title: 'Listado actualizado',
            position: 'topR',
        });
        onClose && onClose();
        setPriceToUpdateListingWith('0');
    };

    const handleCancelListingSuccess = () => {
        dispatch({
            type: 'success',
            message: 'El listado se cancelo con exito',
            title: 'Listado cancelado',
            position: 'topR',
        });
        onClose && onClose();
    };

    const { runContractFunction: cancelListing } = useWeb3Contract({
        abi: titleRegistryAbi,
        contractAddress: address,
        functionName: 'cancelListing',
        params: {
            titleAddress: titleAddress,
            tokenId: tokenId,
        },
    });

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: titleRegistryAbi,
        contractAddress: address,
        functionName: 'updateListings',
        params: {
            titleAddress: titleAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || '0'),
        },
    });

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() =>
                updateListing({
                    onError: (error) => {
                        console.log(error);
                    },
                    onSuccess: handleUpdateListingSuccess,
                })
            }
            title='Detalles del título'
            okText='Guardar nuevo precio'
            cancelText='Salir'
            isOkDisabled={!priceToUpdateListingWith}
        >
            <Input
                label='Actualizar precio del listado en (ETH)'
                name='Nuevo precio'
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value);
                }}
                type='number'
            ></Input>
        </Modal>
    );
};
