module ContractInteraction
  NETWORK_RINKEBY = 'rinkeby'
  NETWORK_MAINNET = 'mainnet'
  NETWORK_BE = 'be'

  def initialize(network = NETWORK_MAINNET)
    @network = network
    check_env
    # XXX validate_network ?
  end

  def contract
    return @contract if @contract

    metadata = contract_metadata

    validate_contract_metadata(metadata)

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

  def contract_metadata
    raise "You must override the contract_metadata method in classes where ContractInteraction is included."
  end

  def check_env
    raise "ENV['AIRDROP_PRIVATE_KEY'] is required" unless ENV['AIRDROP_PRIVATE_KEY'].present?
  end

  def validate_contract_metadata(metadata)
    raise 'Invalid contract metadata' unless metadata.is_a? Hash
    # TODO more validations on metadata (check required fields are present)
  end

  def key
    @key ||= Eth::Key.new(priv: ENV['AIRDROP_PRIVATE_KEY'])
  end

  def client
    return @client if @client
    rpc_endpoint = "https://rinkeby.infura.io/v3/#{ENV['INFURA_API_KEY']}"

    @client = Ethereum::HttpClient.new(rpc_endpoint, nil, true)
    @client.default_account = key.address

    @client
  end

  def rpc_endpoint
    network = @network.to_s
    api_key = ENV['INFURA_API_KEY']
    case network
      when NETWORK_MAINNET
        return "https://mainnet.infura.io/v3/#{api_key}"
      when NETWORK_RINKEBY
        return "https://rinkeby.infura.io/v3/#{api_key}"
      when NETWORK_BE
        raise "Not yet implemented - Bettermask RPC endpoint"
      else
        raise "Invalid network name provided"
    end
  end
end
