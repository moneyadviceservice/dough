require "spec_helper"

class HelperWrapper
  include Dough::Helpers
end

module Dough
  module Helpers
    describe Renderer, type: :controller do
      render_views

      controller do
        helper Dough::Helpers

        def index
          render(inline: "<%= inset_block 'Some instructional text' %>")
        end
      end

      describe "#inset_block" do
        before :each do
          get :index
        end

        it "has an inset_block class" do
          expect(response.body).to include 'class="inset-block"'
        end

        it "has an inset_block content container class" do
          expect(response.body).to include 'class="inset-block__content-container"'
        end

        it "has an inset_block text class" do
          expect(response.body).to include 'class="inset-block__text"'
        end
      end
    end
  end
end
