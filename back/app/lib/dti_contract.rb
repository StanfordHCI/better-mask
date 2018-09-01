class DTIContract
  def initialize
    check_env
  end

  def mint(recipient_address, amount)
    contract.transact_and_wait.mint(recipient_address, amount)
  end

  def contract
    return @contract if @contract

    metadata = contract_metadata

    @contract = Ethereum::Contract.create(
        name: metadata[:name],
        address: metadata[:address],
        abi: metadata[:abi],
        client: client
    )

    @contract.key = key

    @contract
  end

  private

  def check_env
    raise "ENV['DTI_CONTRACT_JSON_DESCRIPTION'] is required" unless ENV['DTI_CONTRACT_JSON_DESCRIPTION'].present?
    raise "ENV['DTI_MINTER_PRIVATE_KEY'] is required" unless ENV['DTI_MINTER_PRIVATE_KEY'].present?
    raise "ENV['RPC_ENDPOINT'] is required" unless ENV['RPC_ENDPOINT'].present?
    raise "ENV['NETWORK_ID'] is required" unless ENV['NETWORK_ID'].present?
  end

  def network_id
    ENV['NETWORK_ID']
  end

  def contract_metadata
    abi_file = File.read(ENV['DTI_CONTRACT_JSON_DESCRIPTION'])

    desc = JSON.parse(abi_file)
    abi = desc['abi']
    name = desc['contractName']
    address = desc['networks'][network_id]['address']

    {abi: abi, name: name, address: address}
  end

  def key
    @key ||= Eth::Key.new(priv: ENV['DTI_MINTER_PRIVATE_KEY'])
  end

  def client
    return @client if @client
    @client = Ethereum::HttpClient.new(ENV['RPC_ENDPOINT'], nil, true)
    @client.default_account = key.address

    @client
  end
end
