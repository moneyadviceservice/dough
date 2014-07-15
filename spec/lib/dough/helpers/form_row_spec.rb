require 'spec_helper'

module Dough
  module Helpers
    class TestFormRowController < AbstractController::Base
      include AbstractController::Helpers
      include AbstractController::Rendering

      helper Dough::Helpers

      def protect_against_forgery?
        false
      end
      helper_method :protect_against_forgery?

      def index
        render inline: "<%= form_for User.new, url: '/' do |f| %>" \
                       "  <%= f.form_row do |row| %>" \
                       "    <%= 'hello world' %>" \
                       "  <% end %>" \
                       "<% end %>"
      end

      private

      def lookup_context
        ActionView::LookupContext.new(ActionController::Base.view_paths)
      end
    end

    describe TestFormRowController do
      it 'adds form row' do
        controller = TestFormRowController.new
        controller.process(:index)
        expect(controller.response_body).to include('form__row')
      end

      it 'renders row contents' do
        controller = TestFormRowController.new
        controller.process(:index)
        expect(controller.response_body).to include('hello world')
      end
    end
  end
end
