import streamlit as st

st.title("AI 해커톤")
st.write("Streamlit 실행 테스트")

topic = st.text_input("분석할 주제를 입력하세요")

if st.button("분석 시작"):
    st.write("입력한 주제:", topic)