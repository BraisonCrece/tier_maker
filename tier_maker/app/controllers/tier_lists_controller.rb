class TierListsController < ApplicationController
  include ActiveStorage::SetCurrent

  before_action :set_tier_list, only: [:show, :update, :destroy]

  # GET /tier_lists
  def index
    @tier_lists = TierList.all
    render json: @tier_lists, include: { images: { methods: :url } }
  end

  # GET /tier_lists/:id
  def show
    render json: @tier_list, include: { images: { methods: :url } }
  end

  # POST /tier_lists
  def create
    @tier_list = TierList.new(tier_list_params)

    if @tier_list.save
      attach_images
      render json: @tier_list, status: :created
    else
      render json: @tier_list.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tier_lists/:id
  def update
    if @tier_list.update(tier_list_params)
      attach_images if params[:images].present?
      render json: @tier_list
    else
      render json: @tier_list.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tier_lists/:id
  def destroy
    @tier_list.destroy
    head :no_content
  end

  private

  def set_tier_list
    @tier_list = TierList.find(params[:id])
  end

  def tier_list_params
    params.require(:tier_list).permit(:name, images: [])
  end

  def attach_images
    params[:images]&.each do |image|
      @tier_list.images.attach(image)
    end
  end
end
