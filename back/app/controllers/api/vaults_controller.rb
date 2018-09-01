class Api::VaultsController < Api::BaseController
  def index
    vault = current_resource_owner_vault
    return render({ json: nil, status: :no_content }) unless vault.present?
    render json: vault, status: :ok
  end

  # This is separated from index because this would potentially be under a different oAuth scope than #index (aka
  # "get total control over all the user's assets" (the scope associated with #index should be only allowed to our
  # own clients, e.g the browser extension)
  def wallet_address
    vault = current_resource_owner_vault
    return render({ json: nil, status: :no_content }) unless vault.present?
    render json: {wallet_address: vault.wallet_address}, status: :ok
  end

  def create
    return render({
                    json: {
                      error: 'This user already has a vault'
                    },
                    status: :bad_request
                  }) if current_resource_owner_vault.present?

    vault = Vault.create(vault_params.merge(user: current_resource_owner))
    render json: vault, status: :created
  end

  def unlock
    vault = current_resource_owner_vault

    return render json: {error: 'The current resource owner doesn\'t own a vault'} unless vault.present?

    render json: {
      vaultUnlockPassword: vault.password,
    }
  end

  private

  def vault_params
    params.permit(:password, :seed_words, :wallet_address)
  end

  def current_resource_owner_vault
    Vault.find_by(user: current_resource_owner)
  end
end
