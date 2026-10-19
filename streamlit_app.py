import streamlit as st

st.markdown("""
<style>
.mvp-row {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    column-gap: 20px;
    align-items: start;
    margin-bottom: 18px;
}

.mvp-label {
    font-weight: 700;
    white-space: nowrap;
}

.mvp-content {
    min-width: 0;
}
.pros-cons {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    margin-top: 28px;
}

.pros-cons-card {
    border: 1px solid rgba(49, 51, 63, 0.2);
    border-radius: 10px;
    padding: 20px 24px;
}

.pros-cons-title {
    font-weight: 700;
    font-size: 1.05rem;
    margin-bottom: 18px;
}

.pros-cons-card ul {
    margin: 0;
    padding-left: 24px;
}

.pros-cons-card li {
    margin-bottom: 8px;
}

@media (max-width: 600px) {
    .pros-cons {
        grid-template-columns: 1fr;
    }
}
</style>
""", unsafe_allow_html=True)


st.title("AI 해커톤 프로젝트 제안")
st.write("해커톤에서 개발할 프로젝트 후보 3종 제안")

if "project" not in st.session_state:
    st.session_state.project = "AI RFP 작성 지원"

if "view" not in st.session_state:
    st.session_state.view = "설명"

with st.container(border=True):
    st.markdown("**프로젝트 선택**")

    project1, project2, project3 = st.columns(3)

    with project1:
        if st.button(
            "AI RFP 작성 지원",
            use_container_width=True
        ):
            st.session_state.project = "AI RFP 작성 지원"

        view1, view2 = st.columns(2)

        with view1:
            if st.button(
                "설명",
                key="rfp_description",
                use_container_width=True
            ):
                st.session_state.project = "AI RFP 작성 지원"
                st.session_state.view = "설명"

        with view2:
            if st.button(
                "데모",
                key="rfp_demo",
                use_container_width=True
            ):
                st.session_state.project = "AI RFP 작성 지원"
                st.session_state.view = "데모"

    with project2:
        if st.button(
            "AI 문서 전처리·구조화",
            use_container_width=True
        ):
            st.session_state.project = "AI 문서 전처리·구조화"

        view1, view2 = st.columns(2)

        with view1:
            if st.button(
                "설명",
                key="document_description",
                use_container_width=True
            ):
                st.session_state.project = "AI 문서 전처리·구조화"
                st.session_state.view = "설명"

        with view2:
            if st.button(
                "데모",
                key="document_demo",
                use_container_width=True
            ):
                st.session_state.project = "AI 문서 전처리·구조화"
                st.session_state.view = "데모"

    with project3:
        if st.button(
            "AI News Intelligence",
            use_container_width=True
        ):
            st.session_state.project = "AI News Intelligence"

        view1, view2 = st.columns(2)

        with view1:
            if st.button(
                "설명",
                key="news_description",
                use_container_width=True
            ):
                st.session_state.project = "AI News Intelligence"
                st.session_state.view = "설명"

        with view2:
            if st.button(
                "데모",
                key="news_demo",
                use_container_width=True
            ):
                st.session_state.project = "AI News Intelligence"
                st.session_state.view = "데모"

project = st.session_state.project
view = st.session_state.view

if project == "AI RFP 작성 지원":
    st.subheader("AI RFP 작성 지원")
    st.caption("내부망 활용형")
    st.subheader("초기 아이디어를 ‘수행사가 이해할 수 있는 요구사항’으로 정리")
    st.write("")
    st.markdown("### 해결할 문제")

    st.write("발주 초기 요구사항은 메모 수준인 경우가 많음.")

    st.markdown("""
- 관리자 화면 필요
- 기존 시스템 연동
- 통계 필요
""")

    st.write("이 상태로는 수행사가 **범위·설계·견적을 판단하기 어려움.**")

    st.write(
        "AI가 바로 RFP를 작성하는 대신 **모호한 표현과 누락 가능 항목을 먼저 확인하고 "
        "요구사항을 구체화.**"
    )

    st.write("사용자 검토 후 **요구사항 명세 → RFP 초안**으로 연결.")

    st.write("")
    st.markdown("### 처리 흐름")

    step1, step2, step3 = st.columns(3)

    with step1:
        st.markdown("**① 요구사항 입력**")
        st.caption("아이디어·메모 수준의 초기 요구사항")

    with step2:
        st.markdown("**② AI 분석·구체화**")
        st.caption("모호한 표현·누락 가능 항목 확인")

    with step3:
        st.markdown("**③ 사용자 검토**")
        st.caption("확인 필요사항 검토·수정")

    step4, step5, step6 = st.columns(3)

    with step4:
        st.markdown("**④ 요구사항 명세**")
        st.caption("검토 결과를 구조화")

    with step5:
        st.markdown("**⑤ RFP 초안**")
        st.caption("확정 요구사항을 RFP로 구성")

    st.write("")
    st.markdown("### 핵심 기능")

    feature1, feature2 = st.columns(2)

    with feature1:
        with st.container(border=True):
            st.markdown("**요구사항 분석**")
            st.write("모호한 표현 탐지·구체화")

    with feature2:
        with st.container(border=True):
            st.markdown("**추가 정보 확인**")
            st.write("범위·설계·견적 판단에 필요한 정보 제안")

    feature3, feature4 = st.columns(2)

    with feature3:
        with st.container(border=True):
            st.markdown("**요구사항 정리**")
            st.write("유사 요구사항 통합·분류")
            st.write("불명확한 내용은 **확인 필요**로 분리")

    with feature4:
        with st.container(border=True):
            st.markdown("**RFP 생성**")
            st.write("검토가 끝난 요구사항을 기준으로 초안 생성")

    st.write("")
    st.markdown("### 해커톤 MVP")
    st.markdown("""
    <div class="mvp-row">
        <div class="mvp-label">⚗ 범위</div>
        <div class="mvp-content">
            가상의 프로젝트와 <strong>10~20개 수준의 초기 요구사항</strong>으로 개발.
        </div>
    </div>

    <div class="mvp-row">
        <div class="mvp-label">⚙ 구현</div>
        <div class="mvp-content">
            <strong>자유 입력 → AI 분석 → 요구사항 표 → 사용자 수정 → RFP 초안 출력</strong>까지 구현.
        </div>
    </div>

    <div class="mvp-row">
        <div class="mvp-label">⊘ 제외</div>
        <div class="mvp-content">
            로그인, 프로젝트 관리, 협업·결재 기능.
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown(
        """
<div class="pros-cons">
<div class="pros-cons-card">
<div class="pros-cons-title">✓ 장점</div>
<div>업무 연관성이 높고 구현 난도가 비교적 낮음</div>
<div style="margin-top: 12px;">모호한 메모가 명세로 바뀌는 과정이 명확해 <strong>데모 효과가 큼</strong></div></div>
<div class="pros-cons-card">
<div class="pros-cons-title">△ 주의점</div>
<div>단순한 <code>GPT에게 RFP 써줘</code> 형태로 보이지 않도록 <strong>요구사항 분석·검토 단계</strong>가 핵심</div>
</div>
</div>
        """,
        unsafe_allow_html=True
    )
elif project == "AI 문서 전처리·구조화":
    st.subheader("AI 문서 전처리·구조화")
    st.write("문서를 AI가 활용하기 좋은 구조의 Markdown으로 변환합니다.")

elif project == "AI News Intelligence":
    st.subheader("AI News Intelligence")
    st.write("여러 뉴스 기사를 이슈 단위로 묶어 비교·분석합니다.")