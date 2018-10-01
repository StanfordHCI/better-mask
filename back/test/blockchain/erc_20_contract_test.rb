require 'test_helper'

class ERC20ContractTest < ActiveSupport::TestCase
  test "transferring 1 RBCT does not throw" do
    # Test contract on Rinkeby:
    contract_address = '0xcedea71788aba67373d7f168347e146fc7546355'
    contract = ERC20Contract.new('rinkeby', contract_address)

    rewarded_user_address = '0x3a1692F85d12e9B2775d1F9bDB6C766ad46FC09E'

    contract.transfer(rewarded_user_address, 1)
  end
end
