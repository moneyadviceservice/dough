require 'spec_helper'

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

      describe '#inset_block' do
        before :each do
          get :index
        end

        it "renders text" do
          expect(response.body).to include('Some instructional text')
        end

        it "has an inset_block class" do
          expect(response.body).to include('class="inset-block"')
        end

        it 'has an inset_block content container class' do
          expect(response.body).to include('class="inset-block__content-container"')
        end

        it 'has an inset_block text class' do
          expect(response.body).to include('class="inset-block__text"')
        end

      end

      describe '#callout_instructional' do

        controller do
          helper Dough::Helpers

          def index
            render(inline: "<%= callout_instructional html_content: {
    heading: '<h3>Budgeting tips</h3>',
    content: '<p>In 1985, average first-time buyers needed a deposit of 5% to buy a home - in 2012, this had increased to 20%
    <br/><strong>Source: HM Treasury </strong>
      </p>'
} %>")
          end
        end

        before :each do
          get :index
        end

        it 'renders html content' do
          expect(response.body).to include('Budgeting tips')
        end

        it 'wraps the text in a div element' do
          expect(response.body).to include('<div class="callout-instructional">')
        end
      end
    end
  end
end
