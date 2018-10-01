class ERC20Contract
  include ContractInteraction

  def initialize(network, contract_address)
    super(network)
    @contract_address = contract_address
  end

  def transfer(recipient_address, amount)
    # XXX amount must be a positive integer of the smallest subdivision of the coin
    # raise "Amount must be a number" unless amount.is_a? Integer
    tx = contract.transact.transfer(recipient_address, amount)

    # TODO return the tx, let the call site handle it
  end

  #
  # Get the balance of tokens available for airdropping
  #
  def balance_available_for_airdrop
    # TODO handle NoMethodError (could mean the contract doesn't comply with the ERC20 spec)
    contract.call.balance_of(key.address)
  end

  def contract_metadata
    abi_path = Rails.root.join('app', 'blockchain', 'abis', 'ERC20.json')
    abi_file = File.read(abi_path)

    desc = JSON.parse(abi_file)

    abi = desc['abi']
    name = 'ERC20'

    {abi: abi, name: name, address: @contract_address}
  end
end
