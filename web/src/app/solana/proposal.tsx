import React, { useState, useEffect } from 'react';
import { withCreateProposal, VoteType, getRealms, CreateProposalArgs } from '@solana/spl-governance';
import { Connection, PublicKey, Transaction, TransactionInstruction, SystemProgram } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';

const governanceProgramId = new PublicKey('GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw');
const realmId = new PublicKey('D4zFiVmuXfQrgFopWJXs2YKGFXasa6b9VT7SjyyxY2Rk');
const governanceId = new PublicKey('D4zFiVmuXfQrgFopWJXs2YKGFXasa6b9VT7SjyyxY2Rk');
const tokenOwnerRecord = new PublicKey('D4zFiVmuXfQrgFopWJXs2YKGFXasa6b9VT7SjyyxY2Rk');
export const CreateProposalForm: React.FC = () => {
    const { publicKey, sendTransaction } = useWallet();
    const [proposalTitle, setProposalTitle] = useState<string>('');
    const [proposalDescription, setProposalDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { connection } = useConnection();
    const handleCreateProposal = async () => {
        if (!publicKey) {
            alert('Please connect your wallet!');
            return;
        }

        setLoading(true);
        try {
            const instructions: TransactionInstruction[] = [];
            const voteType: VoteType = {
                type: 1,
                choiceType: undefined,
                minVoterOptions: undefined,
                maxVoterOptions: undefined,
                maxWinningOptions: undefined,
                isSingleChoice: function (): boolean {
                    throw new Error('Function not implemented.');
                }
            };
            const proposalAddress = await withCreateProposal(
                instructions,                   // Transaction instructions array
                governanceProgramId,             // Governance program ID
                3,
                realmId,                         // Realm ID
                governanceId,                    // Governance account ID
                tokenOwnerRecord,                // Token owner record
                proposalTitle,                   // Proposal title
                proposalDescription,             // Proposal description
                realmId,                         // Governing token mint (Realm ID in this case)
                publicKey,                       // Payer
                0,                               // Proposal index (usually 0 for new proposals)
                voteType,                       // Vote type (single choice is typical)
                [],                       // Options (for multi-choice)
                false,                           // Use proposal deposit
                publicKey                        // Governance authority (usually the same as payer)
            );
            const transferTransaction = new Transaction().add(
                SystemProgram.transfer({
                  fromPubkey: tokenOwnerRecord,
                  toPubkey: tokenOwnerRecord,
                  lamports: 1000,
                })
              );

            console.log(proposalAddress)
            const transaction = new Transaction().add(...instructions);
            const signature = await sendTransaction(transaction, connection);

            alert(`Proposal Created: ${proposalAddress.toBase58()}`);
        } catch (error) {
            console.error('Failed to create proposal:', error);
            alert('Failed to create proposal.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Proposal Title"
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                disabled={loading}
            />
            <textarea
                placeholder="Proposal Description"
                value={proposalDescription}
                onChange={(e) => setProposalDescription(e.target.value)}
                disabled={loading}
            />
            <button onClick={handleCreateProposal} disabled={loading || !proposalTitle || !proposalDescription}>
                {loading ? 'Creating...' : 'Create Proposal'}
            </button>
        </div>
    );
};
