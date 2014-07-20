require 'spec_helper'
class TestHelper < ActionView::Base; end

module Dough
  module Forms
    module Builders
      describe Basic do


        let(:resource)        { User.new }
        let(:template)        { TestHelper.new }
        let(:builder)         { Dough::Forms::Builders::Basic.new(:user, resource, template, {}, nil) }
        let(:normal_input)    { builder.text_field :name }
        let(:required_input)  { builder.text_field :email, type: 'email' }

        context 'inputs' do
          it "should build normal inputs" do
            expect(normal_input).to include '<div class="form__item">'
            expect(normal_input).to include '<label class="form__label-heading" for="user_name">Name</label>'
            expect(normal_input).to include '<input id="user_name" name="user[name]" size="30" type="text" />'
          end

          describe 'required inputs' do
            it "should build required inputs based of a model resource" do
              expect(required_input).to include '<div class="form__item">'
              expect(required_input).to include '<label class="form__label-heading" for="email">Email *</label>'
              expect(required_input).to include '<span class="visually-hidden">required</span>'
              expect(required_input).to include '<input id="email" name="user[email]" size="30" type="email" required="required" aria-required="true" />'
            end
          end

        end

      end
    end
  end
end
