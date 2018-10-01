class ERC721Contract
  include ContractInteraction

  def initialize(network, contract_address)
    super(network)
    @contract_address = contract_address
  end

  def transfer(recipient_address, token_id)
    contract.transact.safe_transfer_from(key.address, recipient_address, token_id)
  end

  def contract
    return @contract if @contract

    metadata = contract_metadata

    @contract = Ethereum::Contract.create(
        name: metadata[:name],
        address: metadata[:address],
        abi: metadata[:abi],
        client: clientF
    )

    @contract.key = key

    @contract
  end

  #
  # Get the token id of a token available for airdropping
  #
  def next_available_token_id
    raise "Not yet implemented"
    # implementation idea: list token ids owned by our backend (ie the public key associated w/ AIRDROP_PRIVATE_KEY)
    # https://ethereum.stackexchange.com/questions/54959/list-erc721-tokens-owned-by-a-user-on-a-web-page
    #
    # return nil unless we find a token id that can be delivered
  end

  private

  def contract_metadata
    abi_path = Rails.root.join('app', 'blockchain', 'abis', 'ERC721.json')
    abi_file = File.read(abi_path)

    desc = JSON.parse(abi_file)

    abi = desc['abi']
    name = 'ERC721'

    {abi: abi, name: name, address: @contract_address}
  end
end
